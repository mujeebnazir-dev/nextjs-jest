/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import connectToDB from "@/lib/db";
import Post from "@/models/Post.model";
import User from "@/models/User.model";

// GET - Fetch all posts or posts by user
export async function GET(request: NextRequest) {
  try {
    const t0 = Date.now();
    await connectToDB();
    const t1 = Date.now();
    console.log(`[TIMING] DB connection: ${t1 - t0}ms`);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    let query = {};
    if (userId) {
      query = { createdBy: userId };
    }

    const skip = (page - 1) * limit;

    const t2 = Date.now();
    const posts = await Post.find(query)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const t3 = Date.now();
    console.log(`[TIMING] Posts query: ${t3 - t2}ms`);

    const t4 = Date.now();
    const totalPosts = await Post.countDocuments(query);
    const t5 = Date.now();
    console.log(`[TIMING] Count query: ${t5 - t4}ms`);

    console.log(`[TIMING] Total GET handler: ${t5 - t0}ms`);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore: skip + posts.length < totalPosts
      }
    });

  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    
    const body = await request.json();
    const { title, content, createdBy} = body;
    // Validation
    if (!title || !content || !createdBy) {
      return NextResponse.json(
        { success: false, message: 'Title, content, and author are required' },
        { status: 400 }
      );
    }
    
    if (title.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Title must be less than 100 characters' },
        { status: 400 }
      );
    }
    
    if (content.length > 1000) {
      console.log("3");
      return NextResponse.json(
        { success: false, message: 'Content must be less than 1000 characters' },
        { status: 400 }
      );
    }
    
    // Create new post
    const newPost = new Post({
      title: title.trim(),
      content: content.trim(),
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedPost = await newPost.save();
    
    // Populate author details for response
    await savedPost.populate('createdBy', 'username email');
    
    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: savedPost
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getStoryComments, addStoryComment } from '@/lib/storiesApi';
import { validateCommentText } from '@/lib/validateComment';

export async function GET(_request, { params }) {
  try {
    const comments = await getStoryComments(params.id);
    return NextResponse.json({ comments });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load comments' }, { status: err.status || 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { name, text } = await request.json();

    if (!name?.trim() || !text?.trim()) {
      return NextResponse.json({ error: 'Name and comment text are required.' }, { status: 400 });
    }

    const validationError = validateCommentText(text) || validateCommentText(name);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const comments = await addStoryComment(params.id, { name: name.trim(), text: text.trim() });
    return NextResponse.json({ comments }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to add comment' }, { status: err.status || 500 });
  }
}
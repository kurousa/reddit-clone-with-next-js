import React, { useEffect, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from '@heroicons/react/outline'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VOTE } from '../graphql/mutations'

type Props = {
  post: Post
}
function Post({ post }: Props) {
  const { data: session } = useSession();
  const [sessionUserVote, setSessionUserVote] = useState<boolean>();
  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    }
  })
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID]
  })
  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast.error("SignIn to Vote!")
      return
    }
    // if already voted, return here.
    if (sessionUserVote && isUpvote) return;
    if (sessionUserVote == false && !isUpvote) return;
    const notification = toast.loading('Posting your vote...')
    try {
      await addVote({
        variables: {
          post_id: post.id,
          username: session?.user?.name,
          upvote: isUpvote
        }
      })
      toast.success('Vote Posted', {
        id: notification
      })
    } catch (error) {
      toast.error('Woops! Something went wrong!', {
        id: notification,
      })
      console.error(error)
    }
  }


  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId
    // find vote by session_user
    const vote_by_session_user = votes?.find(vote => vote.username === session?.user?.name)?.upvote

    setSessionUserVote(vote_by_session_user)
  }, [data])

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId;
    if (votes?.length === 0) return 0;

    const displayVotes = votes?.reduce(
      (total, vote) => vote.upvote ? total += 1 : total -= 1,
      0
    )
    // 
    if (displayVotes === 0) {
      return votes[0]?.upvote ? 1 : -1
    }

    return displayVotes
  }

  if (!post) return (
    <div className='flex w-full items-center justify-center p-10 text-xl'>
      <Jelly size={50} color="#FF4501" />
    </div>
  )

  return (

    <div className='flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600'>
      {/* Votes */}
      <div className='flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400'>
        <ArrowUpIcon
          onClick={() => upVote(true)}
          className={`voteButtons hover:text-red-400 ${sessionUserVote && 'text-red-400'}`}
        />
        <p className='text-xs font-bold text-black'>{displayVotes(data)}</p>
        <ArrowDownIcon
          onClick={() => upVote(false)}
          className={`voteButtons hover:text-blue-400 ${sessionUserVote === false && 'text-blue-400'}`}
        />
      </div>

      {/* Feed Body*/}
      <div className='p-3 pb-1'>
        {/* Header */}
        <div className='flex items-center space-x-2'>
          <Avatar seed={post.subreddit[0]?.topic} />
          <p className='text-xs text-gray-400'>
            <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
              <span className='font-bold text-black hover:text-blue-400 hover:underline '>r/{post.subreddit[0]?.topic}</span>
            </Link>{' '}
            ・Posted by u/{post.username} <TimeAgo date={post.created_at} />
          </p>
        </div>
        <Link href={`/posts/${post.id}`}>
          {/* Body */}
          <div className='py-4'>
            <h2 className='text-xl font-semibold'>{post.title}</h2>
            <p className='text-xs font-light'>{post.body}</p>
          </div>
        </Link>
        {/* Image */}
        <img src={post.image} className='w-full' alt='' />
        {/* Footer */}
        <div className='flex space-x-4 text-gray-400'>
          <div className='postButtons'>
            <ChatAltIcon className='h-6 w-6' />
            <p className='text-xs font-light'>{post.comments.length} Comments</p>
          </div>
          <div className='postButtons'>
            <GiftIcon className='h-6 w-6' />
            <p className='font-light hidden sm:inline'>Award</p>
          </div>
          <div className='postButtons'>
            <ShareIcon className='h-6 w-6' />
            <p className='font-light hidden sm:inline'>Share</p>
          </div>
          <div className='postButtons'>
            <BookmarkIcon className='h-6 w-6' />
            <p className='font-light hidden sm:inline'>Save</p>
          </div>
          <div className='postButtons'>
            <DotsHorizontalIcon className='h-6 w-6' />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Post

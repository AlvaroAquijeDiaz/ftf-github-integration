import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { IUserResponse } from '@/__generated__/UserResponse.types'
import { ParsedUrlQuery } from 'querystring'
import { LoadingState } from '@/ui/LoadingState'
import { UserInfo } from '@/ui/UserInfo'

export interface TReposQuery extends ParsedUrlQuery {
  user: string
}

const Home: NextPage = () => {
  const [searchUserName, setSearchUserName] = useState('')

  const { register, handleSubmit } = useForm<{ name: string }>()

  const { data, error } = useSWR<IUserResponse>(`https://api.github.com/users/${searchUserName}`)

  useEffect(() => {
    if (error) {
      toast.error('Unexpected error :(')
    }
  }, [error])

  const onSubmit = handleSubmit((data) => {
    setSearchUserName(data.name)
  })

  return (
    <div>
      <Head>
        <title>Commit Logger</title>
        <meta name="description" content="Sort of fullstack app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col gap-14 justify-between">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-xl text-neutral-200">Search for a user</h1>
          <form onSubmit={onSubmit}>
            <input
              type="input"
              placeholder="Name like `AlvaroAquijeDiaz`"
              className="text-neutral-200 bg-bg-primary border border-neutral-500 rounded-md p-2 placeholder-neutral-400 
            focus:bg-neutral-700 transition-colors duration-150 text-sm focus:outline-none focus:ring focus:ring-indigo-600"
              {...register('name', { required: true })}
            />
            <button type="submit" />
          </form>
        </div>

        {!data && <LoadingState />}

        {/* This is intentional, since the Github Api retrieves a 2-key object for empty requests */}
        {data && Object.keys(data).length > 2 && <UserInfo user={data} />}
      </main>
    </div>
  )
}

export default Home

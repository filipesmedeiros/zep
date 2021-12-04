import type { NextPage } from 'next'
import Head from 'next/head'

import RecentTransactions from '../components/RecentTransactions'

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>zep⚡️ - dashboard</title>
      </Head>
      <RecentTransactions />
    </>
  )
}

export default Dashboard

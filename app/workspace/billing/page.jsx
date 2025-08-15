import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-5'>Select Plans</h1>
        <PricingTable/>
    </div>
  )
}

export default Billing 
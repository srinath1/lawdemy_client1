import React from 'react'
import UserRoute from '../../components/routes/UserRoute'
import { CloudSyncOutlined } from '@ant-design/icons'

const StripeCancel = () => {
  return (
    <div>

        <UserRoute showNav={false}>
            <div className='row text-center'>
                <div className='col-md-9'>
                <CloudSyncOutlined className='display-1 text-danger p-5'/>
                <p className='lead'>Payment failed try again</p>

                </div>
                <div  className='col-md-3'></div>
            </div>
        </UserRoute>
    </div>
  )
}

export default StripeCancel
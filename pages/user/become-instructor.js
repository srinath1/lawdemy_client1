import React,{useState,useEffect,useContext} from 'react'
import axios from 'axios'
import { Context } from '../../context'
import {Button} from 'antd'
import {SettingOutlined,UserSwitchOutlined,LoadingOutlined} from '@ant-design/icons'
import UserRoute from '../../components/Routes/UserRoute'

const BecomeInstructor = () => {
    const[loading,setLoading]=useState(false)
    const{
        state:{user}
    }=useContext(Context)
    const becomeInstructor=()=>{
        console.log('become instructor')
        setLoading(true)
        axios.post('/api/make-instructor')
        .then(res=>{
            console.log(res)
            window.location.href=res.data
        })
        .catch(err=>{
            console.log(err.response.status)
            setLoading(false)
        })
    }
  return (
    <div className='jumbotron text-center square'>BecomeInstructor
   <div className='container'>
       <div className='row'>
           <div className='col-md-6 offset-md-3 text-center'>
               <div className='pt-4'>
                   <UserSwitchOutlined className='display-1 pb-3'/>
                   <br/>
                   <h2>Setup payment process to publish courses on Lawdemy</h2>
                   <p className='lead text-earning'>
                       Lawdemy partners with stripe to transfers payment to your account
                   </p>
                  <Button className='mb-3'
                   type='primary'
                   block shape="round"
                   size='large'
                   onClick={becomeInstructor}
                   disabled={user && user.role && user.role.includes('instructor') || loading }
                   icon={loading ?<LoadingOutlined/>:<SettingOutlined/>}>
                       {loading ?'Processing...' :'Payout Setup' }
                   </Button>
                   <p className='lead'>You will be directed to stripe to complete onboarding process</p>

                   
               </div>
           </div>
       </div>
   </div>
    </div>
  )
}

export default BecomeInstructor
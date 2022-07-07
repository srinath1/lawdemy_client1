import React,{useState,useEffect,createElement} from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import StudentRoute from '../../../components/Routes/StudentRoute'
import {Button,Menu,Avatar} from 'antd'
import ReactPlayer from 'react-player'
import ReactMarkdown from 'react-markdown'
import { CheckCircleFilled, MenuFoldOutlined, MenuUnfoldOutlined, MinusCircleFilled, PlayCircleOutlined } from '@ant-design/icons'
const {Item}=Menu
const SingleCourse=()=>{
    const[loading,setLoading]=useState(false)
    const[course,setCourses]=useState({lessons:[]})
    const[clicked,setClicked]=useState(-1)
    const[collapsed,setCollapsed]=useState(false)
    const[completedLessons,setCompletedLessons]=useState([])
    const[stateUpdate,setStateUpdate]=useState(false)
    const router=useRouter()
    const {slug}=router.query
    useEffect(()=>{
        if(slug)loadCourse()

    },[slug])

    useEffect(()=>{
        if(course) loadCompletedLessons()

    },[course])

    const loadCompletedLessons = async () => {
        const { data } = await axios.post(`/api/list-completed`, {
          courseId: course._id,
        });
        console.log("COMPLETED LESSONS => ", data);
        setCompletedLessons(data);
      };

    const loadCourse=async()=>{
        const {data}=await axios.get(`/api/user/course/${slug}`)
        setCourses(data)
    }

    const markCompleted=async()=>{
        console.log('send lesson to as mark as completed')
        const {data}=await axios.post(`/api/mark-completed`,{
            courseId:course._id,
            lessonId:course.lessons[clicked]._id
        })
        console.log('Data=>',data)
        setCompletedLessons([...completedLessons,course.lessons[clicked]._id])

    }

    const markIncompleted=async()=>{
       try{
        const {data}=await axios.post(`/api/mark-incomplete`,{
            courseId:course._id,
            lessonId:course.lessons[clicked]._id
        })
        console.log(data)

        const all=completedLessons
        console.log('All=>',all)
        const index=all.indexOf(course.lessons[clicked]._id)
        if(index > -1){
            all.splice(index,1)
            console.log('All without=>',all)
            setCompletedLessons(all)
            setStateUpdate(true)
        }

       }catch(err){
           console.log(err)

       }


    }

    return (

        <StudentRoute>
        <div className='row'>
            <div style={{maxWidth:320}}>
            <Button onClick={()=>setCollapsed(!collapsed)} className='text-primary mt-1 btn-block mb-2'>
        {createElement(collapsed ? MenuFoldOutlined :MenuUnfoldOutlined)} {" "}
        {!collapsed && "Lessons"}
            </Button>
                <Menu
                defaultSelectedKeys={[clicked]}
                inlineCollapsed={collapsed}
                style={{height:'80vh',overflow:'scroll'}}
                >
                    {course.lessons.map((lesson,index)=>(
                        <Item 
                        icon={<Avatar>{index+1}</Avatar>}
                         key={index} onClick={()=>setClicked(index)}>
                            {lesson.title.substring(0,30)}{completedLessons.includes(lesson._id)? (<CheckCircleFilled className="float-right text-primary ml-2" style={{marginTop:'13px'}}/>):(<MinusCircleFilled className="float-right text-danger ml-2" style={{marginTop:'13px'}}/>)}
                        </Item>
                    )

                    )}
                </Menu>
            </div>
            <div className='col'>{clicked !== -1  ? (<>

            <div className='col alert alert-primary square'>
            <b>{course.lessons[clicked].title.substring(0,30)}</b>
                    {completedLessons.includes(course.lessons[clicked]._id)? (
                        <span className='float-right pointer' onClick={markIncompleted}>Mark as incomplete</span>

                    ):(
                        <span className='float-right pointer' onClick={markCompleted}>Mark as completed</span>

                    )}

            </div>
               {course.lessons[clicked].video && course.lessons[clicked].video.Location && (
                   <>
                   <div className='wrapper'>
                       <ReactPlayer
                        className='player'
                         url={course.lessons[clicked].video.Location}
                          width="100%" height="100%" controls
                              onEnded={()=>markCompleted()}
                          />
                   </div>

                   </>
               )}
               <ReactMarkdown source={course.lessons[clicked].content} className='single-post'/>

            </>):(<div className='d-flex justify-content-center p-3'>

                <div className='text-center p-5'>
                    <PlayCircleOutlined className='text-primary display-1 p-5'/>
                    <p className='lead'>Click on the lessons to start learning</p>
                </div>
            </div>)}</div>
        </div>
        
        
         </StudentRoute>
    )

}

export default SingleCourse
import React, {useState,useEffect} from 'react'
import axios from 'axios'
import CourseCard from '../components/cards/courseCard';

const Index = ({courses}) => {
  // const[courses,setCourses]=useState([])
  // useEffect(()=>{
  //   const fetchCourses=async ()=>{
  //     const {data}=await axios.get('/api/courses')
  //     setCourses(data)
  //   }
  //   fetchCourses()
  // },[])

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        Online Law Courses Education Marketplace
      </h1>
      <div className='container-fluid'>
        <div className='row'>
          {courses.map(course=><div key={course._id} className='col-md-4'>
            <CourseCard course={course}/>
          </div>)}
        </div>
      </div>
      
    </>
  );
};

export async function getServerSideProps(){
  const {data}=await axios.get(`${process.env.API}/courses`)
  return {
    props:{
      courses:data
    }
  }
}

export default Index;

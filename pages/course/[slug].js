import { useState, useEffect,useContext } from "react";
import axios from "axios";
import  { useRouter } from "next/router";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/Modal/PreviewModal";
import SingleCourseLesson from "../../components/cards/SingleCourseLesson";
import { Context } from "../../context";
import {loadStripe} from '@stripe/stripe-js'

const SingleCourse = ({ course }) => {
  // state
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const[loading,setLoading]=useState(false)
  const{state:{user}}=useContext(Context)
  const [enrolled,setEnrolled]=useState({})
  const router=useRouter()

  const handlePaidEnrollment=async()=>{
    try{
      setLoading(true)
      if(!user) router.push('/login')
      if(enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`)
      const {data}=await axios.post(`https://lawdemy.herokuapp.com/api/paid-enrollment/${course._id}`)
      console.log('stripe sesson',data)
      const stripe=await loadStripe('pk_test_NhwsAXiyEL3qlLqjuX1WyHg300xY6ZPY9c')
      stripe.redirectToCheckout({sessionId:data})


    }catch(err){
      console.log(err)
      setLoading(false)
    }
  }
  const handleFreeEnrollment=async(e)=>{
    console.log('Free')
    e.preventDefault()
    try{
      if(!user) router.push('/login')
      if(enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`)
      setLoading(true)
      const {data}=await axios.post(`https://lawdemy.herokuapp.com/api/free-enrollment/${course._id}`)
      console.log('freedata',data)
      setLoading(false)
      alert(data.message)

      return router.push(`/user/course/${enrolled.course.slug}`)

    }catch(err){
      console.log(err)
      setLoading(false)
    }

  }
  const checkEnrollment=async()=>{
    const {data}=await axios.get(`https://lawdemy.herokuapp.com/api/check-enrollment/${course._id}`)
    console.log('data',data)
    setEnrolled(data)
  }
  useEffect(()=>{
    if(user && course) checkEnrollment()

  },[user,course])

  return (
    <>
      {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handleFreeEnrollment={handleFreeEnrollment}
        handlePaidEnrollment={handlePaidEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />

      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />

      {course.lessons && (
          <SingleCourseLesson lessons={course.lessons} setPreview={setPreview}
              showModal={showModal}
              setShowModal={setShowModal}
          />
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;

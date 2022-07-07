import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal,List } from "antd";
import { EditOutlined, CheckOutlined, UploadOutlined, QuestionOutlined, CloseOutlined, UserSwitchOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import Item from "antd/lib/list/Item";
// import { toast } from "react-toastify";

const CourseView = () => {
  const [course, setCourse] = useState({});
  const[students,setStudents]=useState(0)
  // for lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(()=>{
    course && studentCount()

  },[course])
  const studentCount=async()=>{
    const {data}=await axios.post(`/api/instructor/student-count`,{
      courseId:course._id
    })
    console.log(data)
    setStudents(data.length)
  }

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  // FUNCTIONS FOR ADD LESSON
  const handleAddLesson =async (e) => {
    e.preventDefault();
try{
  const {data}=await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`,values)
setValues({...values,title:"",content:"",video:{}})
setProgress(0)
setUploadButtonText('Upoad Video')
setVisible(false)

setCourse(data)

} catch(err){

  console.log(err)

} 
  
  };

  const handleVideo = async (e) => {
    console.log(course)
    
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);
      // save progress bar and send video as form data to backend
      const { data } = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((100 * e.loaded) / e.total));
        },
      });
      // once response is received
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      // toast("Video upload failed");
    }
  };
  const handleVideoRemove=async()=>{
    setUploading(true)
    try{
      const {data}=await axios.post(`/api/course/video-remove/${course.instructor._id}`, values.video)
      setValues({...values,video:{}})
      setProgress(0)
      setUploading(false)
      setUploadButtonText('Upload another video')

    }catch(err){
      console.log(err);
      setUploading(false);
    }

  }
  const handlePublish=async(e,courseId)=>{
  try{
    let answer=window.confirm('Once published course will be available for the users to enrol')
    if(!answer)return

    const {data}=await axios.put(`/api/course/publish/${courseId}`)
    setCourse(data)

  }catch(err){
    console.log(err)

  }

  }
  const handleUnpublish=async(e,courseId)=>{
try{
  let answer=window.confirm('Once unpublished course will be not be available for the users to enrol')
  if(!answer)return
  const {data}=await axios.put(`/api/course/unpublish/${courseId}`)
    setCourse(data)
}catch(err){
 

  console.log(err)

}
    
  }

  return (
    <InstructorRoute>
      <div className="contianer-fluid pt-3">
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="media-body pl-2">
                <div className="row">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                      {course.category}
                    </p>
                  </div>

                  <div className="d-flex pt-4">
                  <Tooltip title={`${students} enrolled`}>
                      <UserSwitchOutlined
                       className="h5 pointer text-info mr-4" />
                    </Tooltip>
                    <Tooltip title="Edit">
                      <EditOutlined
                      onClick={()=>router.push(`/instructor/course/edit/${slug}`)}
                       className="h5 pointer text-warning mr-4" />
                    </Tooltip>
                    {course.lessons && course.lessons.length < 5 ?(
                      <Tooltip title="Min 5 lessons required for publishing">
                      <QuestionOutlined className="h5 pointer text-danger"/>

                      </Tooltip>
                    ):course.published ?<Tooltip title="unpublish"><CloseOutlined className="h5 pointer text-danger" onClick={e=>handleUnpublish(e,course._id)}/></Tooltip>:<Tooltip title="publish"><CheckOutlined className="h5 pointer text-success"  onClick={e=>handlePublish(e,course._id)}/></Tooltip>}
                    {/* <Tooltip title="Publish">
                      <CheckOutlined className="h5 pointer text-danger" />
                    </Tooltip> */}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkdown source={course.description} />
              </div>
            </div>
            <div className="row">
              <Button
                onClick={() => setVisible(true)}
                className="col-md-6 offset-md-3 text-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
              >
                Add Lesson
              </Button>
            </div>

            <br />

            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>
            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
             <List itemLayout="horizontal" dataSource={course && course.lessons}
             renderItem={(item,index)=>{
               return <Item>
                 <Item.Meta avatar={<Avatar>{index +1 }</Avatar>}
                 title={item.title}>                 

                 </Item.Meta>
               </Item>
             }}
             >

             </List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;

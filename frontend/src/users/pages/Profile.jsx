import { useContext, useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import { AuthContext } from "../../shared/contexts/AuthContext";
import useFetch from "../../shared/hooks/useFetch";
import LoadingIcon from "../../shared/components/UIElements/LoadingIcon";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import ScribbleList from "../../scribbles/components/ScribbleList";

export default function Profile() {
  const {userId} = useParams();
  const [userData, setUserData] = useState(null);
  const [scribbles, setScribbles] = useState([]);
  const auth = useContext(AuthContext);
  const { sendRequest: sendProfileRequest, isLoading: isProfileLoading, error: profileError, clearError: clearProfileError } = useFetch()
  const { sendRequest: sendScribbleRequest, isLoading: isScribblesLoading, error: scribbleError, clearError: clearScribbleError } = useFetch()

  const fetchProfile = async() => {
    try {
      const responseData = await sendProfileRequest(`http://localhost:8000/api/users/profile/${userId}`);
      setUserData(responseData.user);
      console.log(responseData.user);
    } catch (err) {

    }
  }

  const fetchUserScribbles = async()=>{
    try{
      const responseData = await sendScribbleRequest(`http://localhost:8000/api/scribbles/user/${userId}`);
      setScribbles(responseData.scribbles);
    }catch(err){

    }
  }

  
  useEffect(() => {
    fetchProfile();
    fetchUserScribbles();
  }, [userId])

  useEffect(()=>{
    if(profileError){
      toast(profileError);
      clearProfileError();
    }
  },[profileError])
  
  useEffect(()=>{
    if(scribbleError){
      toast(scribbleError);
      clearScribbleError();
    }
  },[scribbleError])




  return (
    <div className="row container col-lg-8 offset-lg-2 mt-5 p-2">
      <div className="mb-5">
        {userData && (<ProfileCard userData={userData} />)}
      </div>
      <div className="">
        {isScribblesLoading && (
          <div className="mt-5">
            <LoadingIcon />
          </div>
        )}

        {scribbles.length > 0 && (<ScribbleList scribbles={scribbles} />)}
      </div>
    </div>
  )
}

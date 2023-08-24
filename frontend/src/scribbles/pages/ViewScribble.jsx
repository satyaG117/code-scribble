import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import useFetch from "../../shared/hooks/useFetch";
import LoadingIcon from '../../shared/components/UIElements/LoadingIcon';
import { AuthContext } from "../../shared/contexts/AuthContext";
import BinaryChoiceModal from "../../shared/components/UIElements/BinaryChoiceModal";

export default function ViewScribble() {
    const navigate = useNavigate()

    const { scribbleId } = useParams();
    const auth = useContext(AuthContext);
    const [scribble, setScribble] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isForkDisabled, setIsForkDisabled] = useState(false);
    const [isStarDisabled, setIsStarDisabled] = useState(false);
    const [hasStarred, setHasStarred] = useState(null);
    const [starCount, setStarCount] = useState(0);

    const { sendRequest, isLoading, error, clearError } = useFetch()
    const { sendRequest: sendRequestBG, isLoading: isLoadingBG, error: errorBG, clearError: clearErrorBG } = useFetch()

    useEffect(() => {
        console.log(auth)
        let responseData;
        const fetchScribble = async () => {
            try {
                console.log(scribbleId)
                responseData = await sendRequest(`http://localhost:8000/api/scribbles/${scribbleId}`);
                setScribble(responseData.scribble);
                setStarCount(responseData.scribble.starCount)
                console.log(responseData);
            } catch (err) {
                // clearError();
            }
        }
        fetchScribble()
    }, [scribbleId])

    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const responseData = await sendRequestBG(`http://localhost:8000/api/scribbles/${scribbleId}/checkStar`,
                    'GET',
                    null,
                    {
                        'Authorization': `Bearer ${auth.token}`
                    }
                );
                setHasStarred(responseData.hasStarred);
                console.log(responseData)
            } catch (err) {

            }
        }

        if (auth.isLoggedIn) {
            checkLikeStatus();
        }
    }, [scribble])

    useEffect(() => {
        if (error) {
            toast(error);
            clearError();
        }
    }, [error])

    const closeDeleteModal = () => {
        setIsDeleteModalVisible(false);
    }

    const openDeleteModal = () => {
        setIsDeleteModalVisible(true);
    }

    const handleDelete = async () => {
        try {
            await sendRequest(`http://localhost:8000/api/scribbles/${scribbleId}`,
                'DELETE',
                null
                , {
                    'Authorization': `Bearer ${auth.token}`
                })
            navigate('/scribbles');

        } catch (err) {
        }
    }

    const toggleStar = async () => {
        try {
            setIsStarDisabled(true);
            const responseData = await sendRequestBG(`http://localhost:8000/api/scribbles/${scribbleId}/star`, 'POST',
                null,
                {
                    'Authorization': `Bearer ${auth.token}`
                }
            )
            if (hasStarred) {
                setStarCount(prevCount => prevCount - 1);
            } else {
                setStarCount(prevCount => prevCount + 1);
            }
            setHasStarred(prevStatus => !prevStatus);
            setIsStarDisabled(false);
        } catch (err) {
            setIsStarDisabled(false);
        }
    }

    const forkScribble = async () => {
        let responseData;
        try {
            setIsForkDisabled(true);
            responseData = await sendRequest(`http://localhost:8000/api/scribbles/${scribbleId}/fork`, 'POST',
                null,
                {
                    'Authorization': `Bearer ${auth.token}`
                }
            )
            navigate(`/scribbles/${responseData.scribbleId}`);
            setIsForkDisabled(false);
        } catch (err) {
            setIsForkDisabled(false);

        }
    }

    return (
        <>
            <BinaryChoiceModal
                title="Delete ??"
                message="Are you sure you want to delete this scribble? This action is not reversible"
                onClose={closeDeleteModal}
                visible={isDeleteModalVisible}
                onPrimaryAction={handleDelete}
                onSecondaryAction={closeDeleteModal}
                primaryActionText={"Yes"}
                secondaryActionText={"No"}
            />
            {isLoading && < LoadingIcon asOverlay={true} />}
            {scribble && (<div className="container mt-5 col-md-6 offset-md-3">
                <div className="output-display shadow">
                    <iframe
                        srcDoc={`<body>${scribble.html}</body><style>${scribble.css}</style><script>${scribble.js}</script>`}
                        title="output"
                        sandbox="allow-scripts"
                        width="100%"
                        height="400px"
                    />
                </div>

                <div className="card mt-3 bg-dark-blue shadow">
                    <div className="card-header d-flex justify-content-between">
                        <div className="me-auto">
                            <Link className="btn btn-bg btn-info" to={`/scribbles/${scribbleId}/editor`}>Open in Editor</Link>
                        </div>

                        {auth.isLoggedIn && scribble.authorData && auth.userId === scribble.authorData._id &&
                            (<div className="ms-auto">
                                <div className="dropdown">
                                    <button className="btn btn-outline-secondary p-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="white" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                        </svg>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item" to={`/scribbles/${scribbleId}/edit`}>Edit</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item" onClick={openDeleteModal}>Delete</button></li>

                                    </ul>
                                </div>
                            </div>
                            )}

                    </div>
                    <div className="card-body">
                        <div className="card-btn-grp">
                            <div className="my-2">
                                {
                                    hasStarred !== null ? <button className={`btn btn-sm ${hasStarred === true ? 'btn-warning' : 'btn-secondary'}`} disabled={isStarDisabled} onClick={toggleStar} >{starCount} stars</button> : <p>{starCount} stars</p>
                                }


                            </div>
                            {/* <button className="btn btn-sm btn-secondary me-3">Star</button> */}
                            <button className="btn btn-sm btn-secondary me-3" disabled={isForkDisabled} onClick={forkScribble}>Fork</button>
                        </div>
                    </div>
                </div>


                <div className="card mt-3 bg-dark-blue shadow">
                    <div className="card-header">
                        <h4 className="card-title">{scribble.title}</h4>
                        {scribble.authorData && (<><span className="text-emphasis">Author : </span> <Link to={`/profile/${scribble.authorData._id}`}> {scribble.authorData.name}</Link></>)}
                        {scribble.forkedFrom && (<div><span>Forked from : </span><Link to={`/scribbles/${scribble.forkedFrom}`} target="_blank">here</Link></div>)}
                    </div>
                    <div className="card-body">
                        <p className="card-text text-body">{scribble.description}</p>
                        {scribble.lastEditedAt && (<p className="card-text"><small className="text-body-secondary">Last updated at {new Date(scribble.lastEditedAt).toLocaleString()}</small></p>)}
                        {scribble.createdAt && (<p className="card-text"><small className="text-body-secondary">Created at {new Date(scribble.createdAt).toLocaleString()}</small></p>)}

                    </div>
                </div>


            </div>)}

        </>
    )
}

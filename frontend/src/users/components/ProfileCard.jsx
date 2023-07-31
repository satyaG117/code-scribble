import './ProfileCard.css'

export default function ProfileCard(props) {
    return (
        <div className="card bg-dark-blue shadow profile-card py-2 px-4">
            <h4>{props.userData.name}</h4>
            <p>{props.userData.email}</p>
            {props.userData.scribbleCount > 0 && (<p className='scribble-count'>{props.userData.scribbleCount} scribbles</p>)}
        </div>
    )
}

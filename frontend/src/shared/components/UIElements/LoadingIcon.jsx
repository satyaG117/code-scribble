import './LoadingIcon.css'

export default function LoadingIcon(props) {

    if (props.asOverlay) {
        return (
            <div className='overlay'>
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        )

    }


}

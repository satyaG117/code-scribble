import ReactDOM from 'react-dom'
import './Modal.css'

export default function Modal(props) {
    if (!props.visible) return null

    return ReactDOM.createPortal(
        <>
            <div className='overlay'>
                <div className="card my-modal p-3">
                    <div className='row'>
                        <h4 className="card-title col-10">{props.title}</h4>
                        <button className='col-2 btn btn-sm btn-dark' onClick={props.onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="white" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                            </svg>

                        </button>
                    </div>
                    <hr/>
                    {props.children}
                </div>
            </div>

        </>,
        document.getElementById('modal-root')

    )
}
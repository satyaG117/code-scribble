import { Link } from 'react-router-dom'

import './ScribbleCard.css'

const restrictiveCSS = '*{pointer-events: none;transition: none;animation: none;overflow:hidden;}'

export default function ScribbleCard(props) {
    return (
        <div className="card bg-dark-blue border-black scribble-card my-2">
            <div className=''>
                <iframe
                    srcDoc={`<body>${props.html}</body><style>${restrictiveCSS}${props.css}</style>`}
                    title="output"
                    width="100%"
                    height="250px"
                />
            </div>


            <div className="card-body">
                <h5 className="card-title">{props.title}</h5>
                {props.authorName && (<Link to={`/profile/${props.authorId}`}>{props.authorName}</Link>)}
                <hr />
                <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="grey" className="bi bi-star-fill m-2" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>
                    {props.starCount}
                </p>
                <p className="card-text">{props.description.length > 100 ? props.description.slice(0, 100) + "..." : props.description}</p>
                {props.forkedFrom && (<div><span>Forked from </span><Link to={`/scribbles/${props.forkedFrom}`}>here</Link></div>)}
                <Link className="btn btn-warning btn-sm" to={`/scribbles/${props.id}`}>View</Link>
            </div>
        </div>
    )
}

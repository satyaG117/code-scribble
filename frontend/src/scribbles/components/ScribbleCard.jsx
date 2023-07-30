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
                <Link to={`/profile/${props.authorId}`}>{props.authorName}</Link>
                <hr />
                <p className="card-text">{props.description.length > 100 ? props.description.slice(0, 100) + "..." : props.description}</p>
                {props.forkedFrom && (<div><span>Forked from </span><Link to={`/scribbles/${props.forkedFrom}`}>here</Link></div>)}
                <Link className="btn btn-warning btn-sm" to={`/scribbles/${props.id}`}>View</Link>
            </div>
        </div>
    )
}

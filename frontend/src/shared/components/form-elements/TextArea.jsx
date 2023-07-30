import './TextInput.css'

export default function TextArea(props) {
    return (
        <div className="mb-3">
            <label className="form-label" htmlFor={props.name}>{props.label}</label>
            <textarea
                placeholder={props.placeholder}
                className="form-control text-input"
                id={props.name}
                {...props.register(props.name, props.constraints)}
                rows={props.rows}
                cols={props.cols}
            >
            </textarea>
            {props.error && (<small className="error-msg text-danger">{props.error.message}</small>)}
        </div>
    )
}
import './TextInput.css'

export default function TextInput(props) {
    return (

        <div className="mb-3">
            {props.label && (<label className="form-label" htmlFor={props.name}>{props.label}</label>)}
            <input
                placeholder={props.placeholder}
                className="form-control text-input"
                type={props.type}
                id={props.name}
                {...props.register(props.name, props.constraints)}
            />
            {props.error && (<small className="error-msg text-warning">{props.error.message}</small>)}
        </div>

    )
}

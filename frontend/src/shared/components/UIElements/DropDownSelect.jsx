export default function DropDownSelect(props) {
    return (
        <select className="form-select" onChange={props.onChange} value={props.defaultValue} data-bs-theme="dark">
            {props.options.map((option, index) => (<option key={index} value={option.value}>{option.text}</option>))}
        </select>

    )
}

import Modal from "./Modal"

export default function BinaryChoiceModal(props) {
    return (
        <Modal visible={props.visible} title={props.title} onClose={props.onClose}>
            <p>{props.message}</p>
            <hr />
            <div className="container d-flex justify-content-end">
                <button className="btn btn-primary mx-3" onClick={props.onPrimaryAction}>{props.primaryActionText}</button>
                <button className="btn btn-secondary mx-3" onClick={props.onSecondaryAction}>{props.secondaryActionText}</button>
            </div>
        </Modal>
    )
}

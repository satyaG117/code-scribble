import ScribbleCard from "./ScribbleCard"

export default function ScribbleList(props) {
    return (
        
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mt-5 mx-2 m-md-2 m-lg-1">
            {
                props.scribbles.map((scribble,index) => {
                    return (
                        <div className="col" key={scribble._id}>
                            <ScribbleCard
                                id={scribble._id}
                                title={scribble.title}
                                description={scribble.description}
                                authorName={scribble.authorData.name}
                                authorId={scribble.authorData._id}
                                forkedFrom={scribble.forkedFrom}
                                html={scribble.html}
                                css={scribble.css}
                                js={scribble.js}
                                starCount={scribble.starCount}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

import { useState, useEffect, useContext } from 'react'
import { usePrompt } from '../../shared/hooks/usePrompt'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../../shared/contexts/AuthContext'
import DropDownSelect from '../../shared/components/UIElements/DropDownSelect'
import CodeEditor from '../../shared/components/editor/CodeEditor'
import Split from 'react-split'
import './ScribbleEditor.css'
import '../../shared/stylesheets/split.css'
import { useParams, useNavigate } from 'react-router-dom'
import useFetch from '../../shared/hooks/useFetch'
import BinaryChoiceModal from '../../shared/components/UIElements/BinaryChoiceModal'
import LoadingIcon from '../../shared/components/UIElements/LoadingIcon';

const languages = [
    {
        value: 'html',
        text: 'HTML'
    },
    {
        value: 'css',
        text: 'CSS'
    },
    {
        value: 'javascript',
        text: 'Javascript'
    },
]

const editorThemes = [
    {
        value: 'vs-dark',
        text: 'Dark'
    },
    {
        value: 'vs-light',
        text: 'Light'
    },
]

export default function ScribbleEditor() {
    const { scribbleId } = useParams();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { sendRequest, isLoading, error, clearError } = useFetch();
    // for background operation that don't necessarily disrupt normal functioning
    const { sendRequest: sendRequestBG, isLoading: isLoadingBG, error: errorBG, clearError: clearErrorBG } = useFetch();

    const [title, setTitle] = useState('');
    // const [isUnsaved, setIsUnsaved] = useState(true);
    const [authorId, setAuthorId] = useState(null);
    const [html, setHtml] = useState('')
    const [css, setCss] = useState('')
    const [js, setJs] = useState('')
    const [editorTheme, setEditorTheme] = useState('vs-dark')

    const [lastSavedHtml, setLastSavedHtml] = useState('')
    const [lastSavedCss, setLastSavedCss] = useState('')
    const [lastSavedJs, setLastSavedJs] = useState('')

    const [srcDoc, setSrcDoc] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('html')

    const [isSaveDisabled, setIsSaveDisabled] = useState(false);
    const [isForkDisabled , setIsForkDisabled] = useState(false);

    const handleHtmlChange = (value) => {
        setHtml(value);
    }
    const handleCssChange = (value) => {
        setCss(value);
    }
    const handleJsChange = (value) => {
        setJs(value);
    }

    const handleLanguageChange = (e) => {
        setCurrentLanguage(e.target.value)
    }

    const handleThemeChange = (e) => {
        setEditorTheme(e.target.value)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
            <html>
              <style>${css}</style>
              <body>${html}</body>
              <script>${js}</script>
            </html>
          `)
        }, 450)

        return () => clearTimeout(timeout)
    }, [html, css, js])

    const isSaved = () => {
        if (lastSavedHtml != html) return false;
        if (lastSavedCss != css) return false;
        if (lastSavedJs != js) return false;

        return true;
    }

    usePrompt(
        'Any unsaved changes will be lost',
        !isSaved()
    )

    useEffect(() => {
        const fetchScribble = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:8000/api/scribbles/${scribbleId}`);
                setHtml(responseData.scribble.html);
                setCss(responseData.scribble.css);
                setJs(responseData.scribble.js);

                setLastSavedHtml(responseData.scribble.js);
                setLastSavedCss(responseData.scribble.js);
                setLastSavedJs(responseData.scribble.js);

                setAuthorId(responseData.scribble.authorData._id);
                setTitle(responseData.scribble.title);
            } catch (err) {

            }
        }
        fetchScribble();
    }, [])

    const goBack = () => {
        clearError()
        navigate(-1);
    }

    const reloadPage = () => {
        clearError();
        window.location.reload();
    }

    const saveCode = async () => {
        // save last state before
        setIsSaveDisabled(true);
        try {
            if (lastSavedHtml != html) {
                await sendRequestBG(`http://localhost:8000/api/scribbles/${scribbleId}/update-code`, 'PATCH',
                    JSON.stringify({
                        key: 'html',
                        body: html
                    }),
                    {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    })

                setLastSavedHtml(html);
            }
            if (lastSavedCss != css) {
                await sendRequestBG(`http://localhost:8000/api/scribbles/${scribbleId}/update-code`, 'PATCH',
                    JSON.stringify({
                        key: 'css',
                        body: css
                    }),
                    {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                )

                setLastSavedCss(css);
            }
            if (lastSavedJs != js) {
                await sendRequestBG(`http://localhost:8000/api/scribbles/${scribbleId}/update-code`, 'PATCH',
                    JSON.stringify({
                        key: 'js',
                        body: js
                    }),
                    {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                )
                setLastSavedJs(js);
            }
            toast('Saved successfully');
            setIsSaveDisabled(false);
        } catch (err) {
            setIsSaveDisabled(false);

        }
    }

    useEffect(() => {
        if (errorBG) {
            toast(errorBG);
            clearErrorBG();
        }
    }, [errorBG])



    const forkScribble = async () => {
        let responseData;
        try {
            setIsForkDisabled(true);
            responseData = await sendRequestBG(`http://localhost:8000/api/scribbles/${scribbleId}/fork`, 'POST',
                null,
                {
                    'Authorization': `Bearer ${auth.token}`
                }
            )
            navigate(`/scribbles/${responseData.scribbleId}`);
            setIsForkDisabled(false);
        } catch (err) {
            setIsForkDisabled(false);

        }
    }

    return (
        <>
            <BinaryChoiceModal
                visible={error}
                title="ERROR!!!"
                message={error}
                onClose={goBack}
                onPrimaryAction={reloadPage}
                onSecondaryAction={goBack}
                primaryActionText="Retry"
                secondaryActionText="Go back"
            />
            {isLoading && (<LoadingIcon asOverlay={true} />)}
            {srcDoc && <nav className='nav menu-bar p-2 bg-black m-0 row'>
                <h5 className='col-lg-7'>{title}</h5>
                <div className='col-5 col-lg-2'>
                    <DropDownSelect options={languages} onChange={handleLanguageChange} />
                </div>
                <div className='col-3 col-lg-1'>
                    <DropDownSelect options={editorThemes} onChange={handleThemeChange} />
                </div>
                {(authorId == auth.userId) &&
                    <div className='col-2 col-lg-1'>
                        <button className='btn btn-success' onClick={saveCode} disabled={isSaveDisabled}>Save</button>
                    </div>
                }
                <div className='col-2 col-lg-1'>
                    <button className='btn btn-warning' onClick={forkScribble} disabled={isForkDisabled}>Fork</button>
                </div>

            </nav>}
            <div className="main-editor-container container-fluid p-0">

                <Split
                    className='split'
                    minSize={75}
                >
                    <div className='editor-container'>
                        {currentLanguage === 'html' && (<CodeEditor
                            language="html"
                            value={html}
                            onChange={handleHtmlChange}
                            theme={editorTheme}
                        />)}
                        {currentLanguage === 'css' && (<CodeEditor
                            language="css"
                            value={css}
                            onChange={handleCssChange}
                            theme={editorTheme}
                        />)}
                        {currentLanguage === 'javascript' && (<CodeEditor
                            language="javascript"
                            value={js}
                            onChange={handleJsChange}
                            theme={editorTheme}
                        />)}
                    </div>
                    <div className='output-display'>
                        <iframe
                            srcDoc={srcDoc}
                            title="output"
                            sandbox="allow-scripts"
                            width="100%"
                            height="100%"
                        />
                    </div>
                </Split>
            </div>
        </>
    )
}

import { useState, useEffect } from 'react'
import axios from 'axios'
import './About.css'
import loadingIcon from './loading.gif'

const About = () => {
    const [about, setAbout] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState('')
    
    useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`)
      .then(response => {
        setAbout(response.data)
        setError(null)
      })
      .catch(err => {
        setError(JSON.stringify(err, null, 2))
      })
      .finally(() => {
        setLoaded(true)
      })
    }, [])

    if (!loaded) return <img src={loadingIcon} alt="loading" />
    if (error) return <p>Error: {error}</p>

    return (
        <>
            <h1>About: {about.myName}</h1>
            <p className="About">{about.aboutParagraph1}</p>
            <p className="About">{about.aboutParagraph2}</p>
            <img className="About-img" src={about.myImage} alt="Image of me"/>
        </>
    )


}


export default About
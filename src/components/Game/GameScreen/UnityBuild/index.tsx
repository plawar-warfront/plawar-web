const UnityBuild = () => {
    const buildurl = process.env.REACT_APP_ENV !== "development" ? `${process.env.PUBLIC_URL}/unitybuild/index.html` : `${process.env.PUBLIC_URL}/unitybuildlocal/index.html`;

    return <iframe
        src={buildurl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Example Site"
        allowFullScreen
    />
}

export default UnityBuild
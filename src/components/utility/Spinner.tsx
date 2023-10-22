export const Spinner = () => {
    return (
        <>

        <div className="w-full h-full flex items-center justify-center ">
        <div className="spinner-border text-primary" style={{width:'7rem',height:'7rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
           
        </>
    )
}
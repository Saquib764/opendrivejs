import './index.scss'

export default ({children, className=''})=>{
    return (
        <div data-testid='page' className={`motional-page ${className}`}>
            {children}
        </div>
    )
}
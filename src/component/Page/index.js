import './index.scss'

export default ({children, className=''})=>{
    return (
        <div data-testid='page' className={`openui-page ${className}`}>
            {children}
        </div>
    )
}
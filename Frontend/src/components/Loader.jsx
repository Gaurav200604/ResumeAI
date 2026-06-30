import './Loader.scss';

/**
 * Full-page loader with animated logo mark + message.
 * @param {string} message   - Primary text (default: "Loading")
 * @param {string} sub       - Secondary text below the message
 */
const Loader = ({ message = 'Loading', sub = '' }) => (
    <div className='loader-page'>
        <div className='loader-card'>
            {/* Animated logo mark */}
            <div className='loader-icon'>
                <svg viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    {/* Outer ring — spins */}
                    <circle
                        className='loader-icon__ring'
                        cx='20' cy='20' r='17'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                    />
                    {/* Static inner circle */}
                    <circle cx='20' cy='20' r='5' className='loader-icon__dot' />
                    {/* Two orbit dots */}
                    <circle className='loader-icon__orbit loader-icon__orbit--a' r='2.5' />
                    <circle className='loader-icon__orbit loader-icon__orbit--b' r='2.5' />
                </svg>
            </div>

            {/* Text */}
            <p className='loader-message'>{message}</p>
            {sub && <p className='loader-sub'>{sub}</p>}

            {/* Animated dots */}
            <div className='loader-dots'>
                <span /><span /><span />
            </div>
        </div>
    </div>
);

export default Loader;

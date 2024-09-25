import React from 'react';

const Alert = (props) => {
    return (
        <div className={`alert ${props.bg}`}>
            {props.message}
        </div>
    );
};

export default Alert;
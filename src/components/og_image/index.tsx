import React from 'react';

type Props = { code?: string | null };

const OGImage = (props: Props) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--grey-bg)',
                fontFamily:
                    "'Satoshi', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                color: 'white',
            }}
        >
            <h1 style={{ fontWeight: 500, fontSize: 120 }}>{props.code ?? 'Supr-Text'}</h1>
        </div>
    );
};

export default OGImage;

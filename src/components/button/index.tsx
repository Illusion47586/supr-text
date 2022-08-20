import { IconProps, IconWeight } from 'phosphor-react';
import React, { ReactNode } from 'react';

import styles from './index.module.scss';

interface Props {
    onClick: (...params: any[]) => void;
    title?: string;
    icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
    iconWt?: IconWeight;
    isActive?: boolean;
    tabIndex?: number;
    label?: string;
    id?: string;
}

const Button: React.FC<Props> = (props) => {
    return (
        <button
            onClick={props.onClick}
            type="button"
            className={`${styles.button} ${!props.title ? styles.square : ''} ${
                props.isActive === true ? styles.active : ''
            }`}
            tabIndex={props.tabIndex}
            title={props.label ?? props.title}
            id={props.id}
        >
            {props.title && <p>{props.title}</p>}
            {props.icon && (
                <props.icon
                    className={styles.icon}
                    weight={props.iconWt ?? !props.title ? 'regular' : 'bold'}
                />
            )}
        </button>
    );
};

interface GroupProps {
    children: ReactNode;
}

const HorizontalButtonGroup: React.FC<GroupProps> = (props) => {
    return <div className={styles.group_horizontal}>{props.children}</div>;
};

export default Button;
export { HorizontalButtonGroup };

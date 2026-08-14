import React, { useState } from 'react';
import { DEFAULT_AVATAR } from '../../utils/constants';

const Avatar = ({ src, username = 'user', size = 'md' }) => {
    const [imgError, setImgError] = useState(false);

    // If src is missing or image errored, construct default avatar URL
    // DEFAULT_AVATAR is expected to be a string like 'https://api.dicebear.com/7.x/avataaars/svg?seed='
    const fallbackSrc = `${DEFAULT_AVATAR}${username}`;
    const finalSrc = (src && !imgError) ? src : fallbackSrc;

    // Size variants mapped to Tailwind utility classes
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const containerSize = sizeClasses[size] || sizeClasses.md;

    return (
        <div 
            className={`relative inline-block rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 ${containerSize}`}
        >
            <img
                src={finalSrc}
                alt={`${username}'s avatar`}
                aria-label={`${username}'s avatar`}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
            />
        </div>
    );
};

export default Avatar;

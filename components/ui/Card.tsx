import React from 'react'
import styles from './Card.module.css'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
    return (
        <div className={`${styles.card} ${hover ? styles.hover : ''} ${className}`}>
            {children}
        </div>
    )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLobby } from '@/hooks/useLobby'
import Button from '@/components/ui/Button'
import styles from '../multiplayer.module.css'

export default function LobbyPage({ params }: { params: { code: string } }) {
    const router = useRouter()
    const { lobby, players, loading, error, currentUser, toggleReady, leaveLobby, startGame } = useLobby(params.code)

    useEffect(() => {
        if (lobby?.status === 'PLAYING') {
            router.push(`/multiplayer/${params.code}/play`)
        }
    }, [lobby?.status])

    if (loading) return <div className={styles.container}>Loading Lobby...</div>
    if (error) return <div className={styles.container}><div className={styles.error}>{error}</div></div>
    if (!lobby) return <div className={styles.container}>Lobby not found</div>

    const isHost = currentUser?.id === lobby.host_id
    const currentPlayer = players.find(p => p.user_id === currentUser?.id)

    return (
        <main className={styles.container}>
            <div className={styles.backButton}>
                <Button variant="outline" onClick={leaveLobby} size="sm">
                    🚪 Leave Lobby
                </Button>
            </div>

            <div className={styles.glassCard} style={{ maxWidth: '800px' }}>
                <div className={styles.lobbyHeader}>
                    <p className={styles.subtitle}>LOBBY CODE</p>
                    <h1 className={styles.lobbyCode}>{lobby.code}</h1>
                    <p className={styles.subtitle}>Share this code with your friends</p>
                </div>

                <div className={styles.playerGrid}>
                    {players.map(player => (
                        <div key={player.id} className={`${styles.playerCard} ${player.is_ready ? styles.isReady : ''}`}>
                            <div className={styles.avatar}>
                                {player.username.charAt(0).toUpperCase()}
                            </div>
                            <span className={styles.playerName}>
                                {player.username} {player.is_host && '👑'}
                            </span>
                            <span className={`${styles.statusBadge} ${player.is_ready ? styles.ready : ''}`}>
                                {player.is_ready ? 'READY' : 'WAITING'}
                            </span>
                        </div>
                    ))}
                </div>

                <div className={`${styles.buttonGroup}`} style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button
                        size="lg"
                        variant={currentPlayer?.is_ready ? 'secondary' : 'outline'}
                        onClick={toggleReady}
                    >
                        {currentPlayer?.is_ready ? 'Not Ready' : 'I am Ready!'}
                    </Button>

                    {isHost && (
                        <Button
                            size="lg"
                            onClick={startGame}
                        // disabled={players.length < 1} // Host can start solo for testing
                        >
                            🚀 START GAME
                        </Button>
                    )}
                </div>
            </div>
        </main>
    )
}

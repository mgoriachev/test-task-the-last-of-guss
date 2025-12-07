import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRoundStore } from '../../store/rounds';
import { useAuthStore } from '../../store/auth';
import './RoundsListPage.css';

export const RoundsListPage = () => {
  const { user } = useAuthStore();
  const { rounds, isLoading, error, pagination, createRound, getRounds, clearError } = useRoundStore();
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadRounds();
  }, [statusFilter]);

  const loadRounds = () => {
    getRounds(undefined, 10, statusFilter || undefined);
  };

  const handleCreateRound = async () => {
    try {
      await createRound();
      loadRounds();
    } catch (error) {
      console.error('Ошибка при создании раунда:', error);
    }
  };

  const handleLoadMore = () => {
    if (pagination.nextCursor) {
      getRounds(pagination.nextCursor, 10, statusFilter || undefined);
    }
  };

  const getRoundStatus = (round: any) => {
    const now = new Date();
    const startTime = new Date(round.startTime);
    const endTime = new Date(round.endTime);

    if (now < startTime) return 'Ожидание';
    if (now >= startTime && now <= endTime) return 'Активен';
    return 'Завершен';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="rounds-container">
      <div className="rounds-header">
        <h1>Список раундов</h1>
        <div className="user-info">
          <span className="username">{user?.username}</span>
        </div>
      </div>

      <div className="rounds-controls">
        <div className="filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="waiting">Ожидание</option>
            <option value="finished">Завершенные</option>
          </select>
          <button onClick={loadRounds} className="refresh-button">
            Обновить
          </button>
        </div>

        {user?.role === 'ADMIN' && (
          <button 
            onClick={handleCreateRound}
            disabled={isLoading}
            className="create-round-button"
          >
            Создать раунд
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError} className="error-close">×</button>
        </div>
      )}

      {isLoading && rounds.length === 0 ? (
        <div className="loading">Загрузка раундов...</div>
      ) : (
        <>
          <div className="rounds-grid">
            {rounds.map((round) => (
              <Link 
                key={round.id} 
                to={`/round/${round.id}`}
                className="round-card"
              >
                <div className="round-id">
                  <span className="round-icon">●</span>
                  Round ID: {round.id.substring(0, 8)}...
                </div>
                
                <div className="round-times">
                  <div className="time-row">
                    <span className="time-label">Start:</span>
                    <span className="time-value">{formatDate(round.startTime)}</span>
                  </div>
                  <div className="time-row">
                    <span className="time-label">End:</span>
                    <span className="time-value">{formatDate(round.endTime)}</span>
                  </div>
                </div>

                <div className="round-divider"></div>

                <div className="round-footer">
                  <div className={`round-status status-${getRoundStatus(round).toLowerCase()}`}>
                    {getRoundStatus(round)}
                  </div>
                  <div className="round-score">
                    Всего очков: {round.totalScore}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pagination.hasMore && (
            <div className="load-more">
              <button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="load-more-button"
              >
                {isLoading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
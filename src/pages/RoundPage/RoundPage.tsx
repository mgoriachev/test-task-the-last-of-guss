import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoundStore } from '../../store/rounds';
import { useAuthStore } from '../../store/auth';
import './RoundPage.css';

export const RoundPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRound, isLoading, error, getRoundDetails, registerTap, clearError } = useRoundStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTapping, setIsTapping] = useState(false);

  useEffect(() => {
    if (id) {
      loadRoundDetails();
    }
  }, [id]);

  useEffect(() => {
    if (currentRound) {
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [currentRound]);

  const loadRoundDetails = async () => {
    if (id) {
      await getRoundDetails(id);
    }
  };

  const updateTimer = () => {
    if (!currentRound) return;

    const now = new Date();
    const startTime = new Date(currentRound.round.startTime);
    const endTime = new Date(currentRound.round.endTime);

    if (now < startTime) {
      // Ожидание начала
      setTimeLeft(Math.floor((startTime.getTime() - now.getTime()) / 1000));
    } else if (now >= startTime && now <= endTime) {
      // Активный раунд
      setTimeLeft(Math.floor((endTime.getTime() - now.getTime()) / 1000));
    } else {
      // Раунд завершен
      setTimeLeft(0);
    }
  };

  const getRoundStatus = () => {
    if (!currentRound) return 'Загрузка...';

    const now = new Date();
    const startTime = new Date(currentRound.round.startTime);
    const endTime = new Date(currentRound.round.endTime);

    if (now < startTime) return 'Ожидание';
    if (now >= startTime && now <= endTime) return 'Активен';
    return 'Завершен';
  };

  const getStatusTitle = () => {
    const status = getRoundStatus();
    if (status === 'Активен') return 'Раунд активен!';
    if (status === 'Ожидание') return 'Cooldown';
    return 'Раунд завершен';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTap = useCallback(async () => {
    if (!id || isTapping || getRoundStatus() !== 'Активен') return;

    setIsTapping(true);
    try {
      await registerTap(id);
    } catch (error) {
      console.error('Ошибка при тапе:', error);
    } finally {
      setIsTapping(false);
    }
  }, [id, isTapping, getRoundStatus()]);

  const handleBack = () => {
    navigate('/play');
  };

  if (!currentRound && isLoading) {
    return (
      <div className="round-container">
        <div className="round-content">
          <div className="loading">Загрузка раунда...</div>
        </div>
      </div>
    );
  }

  if (!currentRound) {
    return (
      <div className="round-container">
        <div className="round-content">
          <div className="error-message">
            Раунд не найден
            <button onClick={handleBack} className="back-button">
              Вернуться к списку
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = getRoundStatus();
  const isActive = status === 'Активен';
  const isCooldown = status === 'Ожидание';

  return (
    <div className="round-container">
      <div className="round-header">
        <button onClick={handleBack} className="back-button">
          ← Назад
        </button>
        <div className="round-title">{getStatusTitle()}</div>
        <div className="user-info">
          <span className="username">{user?.username}</span>
        </div>
      </div>

      <div className="round-content">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={clearError} className="error-close">×</button>
          </div>
        )}

        <div className="game-circle">
          <div className="circle-outer">
            <div className="circle-middle">
              <div className="circle-inner">
                {isActive ? (
                  <button 
                    className="tap-button"
                    onClick={handleTap}
                    disabled={isTapping || !isActive}
                  >
                    {isTapping ? 'Тап...' : 'ТАП!'}
                  </button>
                ) : (
                  <div className="status-text">
                    {isCooldown ? 'Cooldown' : 'Завершен'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="game-info">
          {isActive || isCooldown ? (
            <>
              <div className="timer">
                {isActive ? 'До конца осталось:' : 'До начала раунда:'}
                <div className="time-value">{formatTime(timeLeft)}</div>
              </div>
              
              {isActive && (
                <div className="my-score">
                  Мои очки - {currentRound.myStats.score}
                  <div className="taps-count">
                    Тапов: {currentRound.myStats.taps}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="round-stats">
              <div className="stats-title">Статистика раунда</div>
              
              <div className="stat-row">
                <span className="stat-label">Всего:</span>
                <span className="stat-value">{currentRound.round.totalScore}</span>
              </div>

              {currentRound.topStats.length > 0 && (
                <div className="stat-row winner">
                  <span className="stat-label">Победитель - {currentRound.topStats[0].user.username}:</span>
                  <span className="stat-value">{currentRound.topStats[0].score}</span>
                </div>
              )}

              <div className="stat-row my-stats">
                <span className="stat-label">Мои очки:</span>
                <span className="stat-value">{currentRound.myStats.score}</span>
              </div>
            </div>
          )}
        </div>

        <div className="round-details">
          <h3>Информация о раунде:</h3>
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{currentRound.round.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Начало:</span>
            <span className="detail-value">
              {new Date(currentRound.round.startTime).toLocaleString('ru-RU')}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Конец:</span>
            <span className="detail-value">
              {new Date(currentRound.round.endTime).toLocaleString('ru-RU')}
            </span>
          </div>
        </div>

        {currentRound.topStats.length > 0 && (
          <div className="leaderboard">
            <h3>Топ игроков:</h3>
            <div className="leaderboard-list">
              {currentRound.topStats.slice(0, 5).map((stat, index) => (
                <div key={index} className="leaderboard-item">
                  <div className="leaderboard-rank">#{index + 1}</div>
                  <div className="leaderboard-user">{stat.user.username}</div>
                  <div className="leaderboard-score">{stat.score} очков</div>
                  <div className="leaderboard-taps">{stat.taps} тапов</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
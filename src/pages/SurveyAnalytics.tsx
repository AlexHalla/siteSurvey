import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './SurveyAnalytics.module.css';
import apiService from '../services/api';

type AnalyticsSurvey = {
  survey_id: string;
  name: string;
  description: string;
  author: string;
  questions_count: number;
  scales_count: number;
};

type AnalyticsRespondent = {
  user_id: string;
  display_name?: string;
  attempts_count: number;
  first_completed_at?: string | null;
  last_completed_at?: string | null;
};

type AttemptAnswer = {
  question_id: number;
  question_text: string;
  option_id: number;
  option_text: string;
};

type AnalyticsAttempt = {
  result_id: string;
  session_id: string;
  completed_at?: string | null;
  started_at?: string | null;
  duration_seconds?: number | null;
  result_texts: string[];
  answers_count: number;
  answers: AttemptAnswer[];
  client_platform?: string | null;
  client_user_agent?: string | null;
};

const SurveyAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { surveyId: routeSurveyId, userId: routeUserId, attemptId: routeAttemptId } = useParams();
  const isAttemptWindowMode = Boolean(routeAttemptId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [surveys, setSurveys] = useState<AnalyticsSurvey[]>([]);
  const [respondents, setRespondents] = useState<AnalyticsRespondent[]>([]);
  const [attempts, setAttempts] = useState<AnalyticsAttempt[]>([]);

  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [selectedSurveyName, setSelectedSurveyName] = useState<string>('');
  const [selectedRespondentId, setSelectedRespondentId] = useState<string | null>(null);
  const [selectedRespondentName, setSelectedRespondentName] = useState<string>('');
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState<number | null>(null);

  const loadSurveys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getMySurveyAnalytics();
      setSurveys(response.surveys ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Не удалось загрузить опросы');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSurveys();
  }, [loadSurveys]);

  const loadRespondents = useCallback(
    async (surveyId: string, surveyName: string) => {
      setIsLoading(true);
      setError(null);
      setSelectedSurveyId(surveyId);
      setSelectedSurveyName(surveyName);
      setSelectedRespondentId(null);
      setSelectedRespondentName('');
      setSelectedAttemptIndex(null);
      setAttempts([]);

      try {
        const response = await apiService.getSurveyRespondents(surveyId);
        setRespondents(response.respondents ?? []);
      } catch (e: any) {
        setError(e?.message ?? 'Не удалось загрузить пользователей');
        setRespondents([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const loadAttempts = useCallback(async (surveyId: string, userId: string, displayName?: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedRespondentId(userId);
    setSelectedRespondentName(displayName || userId);
    setSelectedAttemptIndex(null);

    try {
      const response = await apiService.getSurveyRespondentAttempts(surveyId, userId);
      setSelectedRespondentName(response.respondent_display_name || displayName || userId);
      setAttempts(response.attempts ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Не удалось загрузить прохождения');
      setAttempts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!routeSurveyId || surveys.length === 0) {
      return;
    }
    if (selectedSurveyId === routeSurveyId) {
      return;
    }

    const survey = surveys.find((item) => item.survey_id === routeSurveyId);
    if (survey) {
      void loadRespondents(survey.survey_id, survey.name);
    }
  }, [routeSurveyId, surveys, selectedSurveyId, loadRespondents]);

  useEffect(() => {
    if (!routeSurveyId || !routeUserId || selectedSurveyId !== routeSurveyId) {
      return;
    }
    if (selectedRespondentId === routeUserId && attempts.length > 0) {
      return;
    }

    const respondent = respondents.find((item) => item.user_id === routeUserId);
    void loadAttempts(routeSurveyId, routeUserId, respondent?.display_name);
  }, [
    routeSurveyId,
    routeUserId,
    selectedSurveyId,
    selectedRespondentId,
    respondents,
    attempts.length,
    loadAttempts,
  ]);

  useEffect(() => {
    if (!routeAttemptId || attempts.length === 0) {
      setSelectedAttemptIndex(null);
      return;
    }

    const foundIndex = attempts.findIndex((item) => item.result_id === routeAttemptId);
    setSelectedAttemptIndex(foundIndex >= 0 ? foundIndex : null);
  }, [routeAttemptId, attempts]);

  const handleSurveySelect = async (surveyId: string, surveyName: string) => {
    await loadRespondents(surveyId, surveyName);
    navigate(`/analytics/${surveyId}`);
  };

  const handleRespondentSelect = async (userId: string, displayName?: string) => {
    if (!selectedSurveyId) {
      return;
    }
    await loadAttempts(selectedSurveyId, userId, displayName);
    navigate(`/analytics/${selectedSurveyId}/${userId}`);
  };

  const resetToSurveys = () => {
    setSelectedSurveyId(null);
    setSelectedSurveyName('');
    setSelectedRespondentId(null);
    setSelectedRespondentName('');
    setSelectedAttemptIndex(null);
    setRespondents([]);
    setAttempts([]);
    navigate('/analytics');
  };

  const resetToRespondents = () => {
    if (!selectedSurveyId) {
      return;
    }
    setSelectedRespondentId(null);
    setSelectedRespondentName('');
    setSelectedAttemptIndex(null);
    setAttempts([]);
    navigate(`/analytics/${selectedSurveyId}`);
  };

  const closeAttemptView = () => {
    if (selectedSurveyId && selectedRespondentId) {
      navigate(`/analytics/${selectedSurveyId}/${selectedRespondentId}`);
    }
    setSelectedAttemptIndex(null);
  };

  const openAttemptInNewWindow = (attempt: AnalyticsAttempt) => {
    if (!selectedSurveyId || !selectedRespondentId) {
      return;
    }
    const url = `/analytics/${selectedSurveyId}/${selectedRespondentId}/${attempt.result_id}`;
    window.open(url, 'analyticsAttemptWindow', 'width=1280,height=900,noopener,noreferrer');
  };

  const formatDate = (value?: string | null) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString('ru-RU');
  };

  const currentAttempt = useMemo(() => {
    if (selectedAttemptIndex === null) {
      return null;
    }
    return attempts[selectedAttemptIndex] ?? null;
  }, [attempts, selectedAttemptIndex]);

  const previousAttempt = useMemo(() => {
    if (selectedAttemptIndex === null || selectedAttemptIndex <= 0) {
      return null;
    }
    return attempts[selectedAttemptIndex - 1] ?? null;
  }, [attempts, selectedAttemptIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {!isAttemptWindowMode && <h1 className={styles.title}>Аналитика опросов</h1>}
        {!isAttemptWindowMode && (
          <div className={styles.breadcrumbs}>
            <button
              className={styles.crumb}
              onClick={resetToSurveys}
              disabled={!selectedSurveyId || isAttemptWindowMode}
            >
              Мои опросы
            </button>
            {selectedSurveyId && (
              <button
                className={styles.crumb}
                onClick={resetToRespondents}
                disabled={!selectedRespondentId || isAttemptWindowMode}
              >
                {selectedSurveyName}
              </button>
            )}
            {selectedRespondentId && (
              <span className={styles.crumbCurrent}>{selectedRespondentName || selectedRespondentId}</span>
            )}
          </div>
        )}

        {isLoading && <div className={styles.info}>Загрузка...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!isLoading && !isAttemptWindowMode && !selectedSurveyId && (
          <div className={styles.list}>
            {surveys.length === 0 && <div className={styles.info}>У вас пока нет созданных опросов.</div>}
            {surveys.map((survey) => (
              <button
                key={survey.survey_id}
                className={styles.item}
                onClick={() => handleSurveySelect(survey.survey_id, survey.name)}
              >
                <div className={styles.itemTitle}>{survey.name}</div>
                <div className={styles.itemDescription}>{survey.description}</div>
                <div className={styles.meta}>
                  Вопросов: {survey.questions_count} · Шкал: {survey.scales_count}
                </div>
              </button>
            ))}
          </div>
        )}

        {!isLoading && !isAttemptWindowMode && selectedSurveyId && !selectedRespondentId && (
          <div className={styles.list}>
            {respondents.length === 0 && <div className={styles.info}>По этому опросу пока нет прохождений.</div>}
            {respondents.map((respondent) => (
              <button
                key={respondent.user_id}
                className={styles.item}
                onClick={() => handleRespondentSelect(respondent.user_id, respondent.display_name)}
              >
                <div className={styles.itemTitle}>
                  Пользователь: {respondent.display_name || respondent.user_id}
                </div>
                <div className={styles.meta}>ID: {respondent.user_id}</div>
                <div className={styles.meta}>Прохождений: {respondent.attempts_count}</div>
                <div className={styles.meta}>
                  Первое: {formatDate(respondent.first_completed_at)} · Последнее: {formatDate(respondent.last_completed_at)}
                </div>
              </button>
            ))}
          </div>
        )}

        {!isLoading && !isAttemptWindowMode && selectedSurveyId && selectedRespondentId && (
          <>
            <div className={styles.list}>
              {attempts.length === 0 && <div className={styles.info}>У пользователя нет завершённых прохождений.</div>}
              {attempts.map((attempt, index) => (
                <div key={attempt.result_id} className={styles.attemptCard}>
                  <div className={styles.itemTitle}>Попытка #{index + 1}</div>
                  <div className={styles.meta}>Session: {attempt.session_id}</div>
                  <div className={styles.meta}>Завершено: {formatDate(attempt.completed_at)}</div>
                  <div className={styles.meta}>Начато: {formatDate(attempt.started_at)}</div>
                  <div className={styles.meta}>Длительность: {attempt.duration_seconds ?? 0} сек</div>
                  <div className={styles.meta}>Ответов: {attempt.answers_count}</div>
                  <div className={styles.meta}>Платформа: {attempt.client_platform || '—'}</div>
                  <button className={styles.openAttemptButton} onClick={() => openAttemptInNewWindow(attempt)}>
                    Открыть в отдельном окне
                  </button>
                </div>
              ))}
            </div>

            {currentAttempt && (
              <AttemptDetails
                currentAttempt={currentAttempt}
                previousAttempt={previousAttempt}
                currentAttemptNumber={(selectedAttemptIndex ?? 0) + 1}
                onClose={closeAttemptView}
              />
            )}
          </>
        )}

        {!isLoading && isAttemptWindowMode && (
          <>
            {!currentAttempt && (
              <div className={styles.info}>
                Не удалось найти попытку по URL. Проверьте корректность ссылки.
              </div>
            )}
            {currentAttempt && (
              <AttemptDetails
                currentAttempt={currentAttempt}
                previousAttempt={previousAttempt}
                currentAttemptNumber={(selectedAttemptIndex ?? 0) + 1}
                onClose={() => {
                  if (window.opener) {
                    window.close();
                  } else {
                    closeAttemptView();
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

type AttemptDetailsProps = {
  currentAttempt: AnalyticsAttempt;
  previousAttempt: AnalyticsAttempt | null;
  currentAttemptNumber: number;
  onClose: () => void;
};

const AttemptDetails: React.FC<AttemptDetailsProps> = ({
  currentAttempt,
  previousAttempt,
  currentAttemptNumber,
  onClose,
}) => {
  const previousByQuestion = useMemo(
    () => new Map((previousAttempt?.answers ?? []).map((item) => [item.question_id, item])),
    [previousAttempt],
  );

  const orderedQuestionIds = useMemo(() => {
    const currentIds = (currentAttempt.answers ?? []).map((item) => item.question_id);
    const previousIds = Array.from(previousByQuestion.keys());
    return Array.from(new Set([...currentIds, ...previousIds]));
  }, [currentAttempt.answers, previousByQuestion]);

  return (
    <div className={styles.detailsPanel}>
      <div className={styles.detailsHeader}>
        <h2 className={styles.detailsTitle}>Ответы в попытке #{currentAttemptNumber}</h2>
        <button className={styles.closeButton} onClick={onClose}>
          Закрыть просмотр
        </button>
      </div>

      {!previousAttempt && (
        <div className={styles.singleColumn}>
          {orderedQuestionIds.map((questionId) => {
            const current = (currentAttempt.answers ?? []).find((item) => item.question_id === questionId);
            if (!current) {
              return null;
            }
            return (
              <div key={`single-${questionId}`} className={styles.answerRow}>
                <div className={styles.questionText}>{current.question_text}</div>
                <div className={styles.answerText}>{current.option_text}</div>
              </div>
            );
          })}
        </div>
      )}

      {previousAttempt && (
        <div className={styles.twoColumns}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Текущая попытка</h3>
            {orderedQuestionIds.map((questionId) => {
              const current = (currentAttempt.answers ?? []).find((item) => item.question_id === questionId);
              const previous = previousByQuestion.get(questionId);
              const changed = (current?.option_id ?? null) !== (previous?.option_id ?? null);

              return (
                <div key={`current-${questionId}`} className={`${styles.answerRow} ${changed ? styles.changed : ''}`}>
                  <div className={styles.questionText}>
                    {current?.question_text || previous?.question_text || `Question ${questionId}`}
                  </div>
                  <div className={styles.answerText}>{current?.option_text || '—'}</div>
                </div>
              );
            })}
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Предыдущая попытка</h3>
            {orderedQuestionIds.map((questionId) => {
              const current = (currentAttempt.answers ?? []).find((item) => item.question_id === questionId);
              const previous = previousByQuestion.get(questionId);
              const changed = (current?.option_id ?? null) !== (previous?.option_id ?? null);

              return (
                <div key={`previous-${questionId}`} className={`${styles.answerRow} ${changed ? styles.changed : ''}`}>
                  <div className={styles.questionText}>
                    {previous?.question_text || current?.question_text || `Question ${questionId}`}
                  </div>
                  <div className={styles.answerText}>{previous?.option_text || '—'}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyAnalytics;

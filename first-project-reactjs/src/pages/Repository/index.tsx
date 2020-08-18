import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import { Header, RepositoryInfo, Issues } from './styles';
import api from '../../services/api';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  },
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  }
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [repositorie, setRepositorie] = useState<Repository | null>(null);
  const [issue, setIssue] = useState<Issue[]>([]);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const [repository, issues] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`),
      ]);

      setRepositorie(repository.data);
      setIssue(issues.data);
    };

    loadData();
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Gitub Explorer" />
        <Link to="/dashboard">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repositorie && (
        <RepositoryInfo>
          <header>
            <img src={repositorie.owner.avatar_url} alt={repositorie.full_name} />
            <div>
              <strong>{repositorie.full_name}</strong>
              <p>{repositorie.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repositorie.stargazers_count}</strong>
              <span>Star</span>
            </li>
            <li>
              <strong>{repositorie.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repositorie.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {
          issue.map((iss) => (
            <a key={iss.id} href={iss.html_url}>
              <div>
                <strong>{iss.title}</strong>
                <p>{iss.user.login}</p>
              </div>

              <FiChevronRight size={20} color="#cbcbd6" />
            </a>
          ))
        }
      </Issues>
    </>
  );
};

export default Repository;

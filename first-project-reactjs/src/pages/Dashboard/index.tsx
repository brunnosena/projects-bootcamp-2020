import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import {
  Title, Form, Repositories, Error,
} from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem('@GitHubExplorer:repositories');

    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('@GitHubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  const handleAddRepositories = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!newRepo) {
      setInputError('Digite autor/nome do repositório.');
      return;
    }

    try {
      const response = await api.get(`/repos/${newRepo}`);

      setRepositories([...repositories, response.data]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório.');
    }
  };

  return (
    <>
      <img src={logoImg} alt="GitHub Explorer" />
      <Title>Explore repositórios no GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepositories}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          type="text"
          placeholder="Digite o nome do seu repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      { inputError && <Error>{inputError}</Error> }

      <Repositories>
        {
        repositories.map((repository: Repository) => (
          <Link key={repository.full_name} to={`repositories/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} alt={repository.full_name} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} color="#cbcbd6" />
          </Link>
        ))
        }
      </Repositories>

    </>
  );
};

export default Dashboard;

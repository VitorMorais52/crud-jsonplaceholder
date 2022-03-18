import styled from "styled-components";

export const Container = styled.div`
  .buttons {
    display: flex;
    justify-content: center;
  }

  .not-results {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

type StatusProps = {
  completed?: boolean;
};
export const Status = styled.span<StatusProps>`
  color: ${({ completed }) => (completed ? "green" : "rgba(255,0,0,0.5)")};
  font-weight: 600;
`;

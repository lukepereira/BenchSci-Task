import React, { Component } from 'react';
import { withRR4, Nav, NavText } from 'react-sidenav';
import styled from 'styled-components';

const SideNav = withRR4();

const BaseContainer = props => <div style={{
  textAlign: 'left',
  display: 'inline-block',
  paddingTop: 10,
  paddingBottom: 10,
  fontFamily: 'Lato',
  width: 200, ...props.style
}}>{props.children}</div>;


const SeparatorTitleContainer = styled.div`
    font-size: 14px;
    color: #AAA;
    margin: 10px 10px;
    padding: 5px 10px 5px;
`;

const SeparatorTitle = (props) => {
    return (
        <SeparatorTitleContainer>
            { props.children }
            <hr style={{border: 0, borderTop: '1px solid #E5E5E5'}}/>
        </SeparatorTitleContainer>
    );
};

class NavBar extends Component {

  render() {
    return (
      < div style={{marginTop: 50+550/2}}>
      <BaseContainer style={{background: '#7FFF00', color: '#FFF'}}>
      <SideNav highlightBgColor='#fff' highlightColor='green'>
          <SeparatorTitle></SeparatorTitle>
          <Nav id='park'>
          <NavText>park</NavText>
              <NavText>park</NavText>
          </Nav>
          <Nav id='account'>
              <NavText>account</NavText>
          </Nav>
          <SeparatorTitle></SeparatorTitle>
      </SideNav>
      </BaseContainer>
      </div>
    )
  }
}

export default NavBar;

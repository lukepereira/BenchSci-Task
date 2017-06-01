import React, { Component } from 'react';
import { withRR4, Nav, NavText } from 'react-sidenav';
import styled from 'styled-components';

const SideNav = withRR4();

const BaseContainer = props => <div style={{
  textAlign: 'left',
  display: 'inline-block',
  paddingTop: 16,
  paddingBottom: 16,
  fontFamily: 'Roboto',
  width: 200, ...props.style
}}>{props.children}</div>;


const SeparatorTitleContainer = styled.div`
    font-size: 14px;
    color: #AAA;
    margin: 10px 12px;
    padding: 4px 12px 2px;
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
      < div style={{marginTop: 65+550/2}}>
      <BaseContainer style={{background: '#2c3e50', color: '#FFF'}}>
      <SideNav highlightBgColor='#f60' highlightColor='white'>
          <SeparatorTitle></SeparatorTitle>
          <Nav id='library'>
              <NavText>Gene Library</NavText>
          </Nav>
          <Nav id='account'>
              <NavText>Account</NavText>
          </Nav>
          <SeparatorTitle></SeparatorTitle>
      </SideNav>
      </BaseContainer>
      </div>
    )
  }
}

export default NavBar;
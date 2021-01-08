import React from 'react';
import styled from 'styled-components';
import SearchCity from './SearchCity';
import device from '../responsive/Device';
import Result from './Result';
import NotFound from './NotFound';


const AppTitle = styled.h1`
  display: block;
  height: 64px;
  margin: 0;
  padding: 20px 0;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 400;
  color: #ffffff;
  transition: 0.3s 1.4s;
  opacity: ${({ showLabel }) => (showLabel ? 1 : 0)};

  ${({ secondary }) =>
    secondary &&
    `
    opacity: 1;
    height: auto;
    position: relative;
    padding: 20px 0;
    font-size: 30px;
    top: 20%;
    text-align: center;
    transition: .5s;
    @media ${device.tablet} {
      font-size: 40px;
    }
    @media ${device.laptop} {
      font-size: 50px;
    }
    @media ${device.laptopL} {
      font-size: 60px;
    }
    @media ${device.desktop} {
      font-size: 70px;
    }
    
  `}

  ${({ showResult }) =>
    showResult &&
    `
    opacity: 0;
    visibility: hidden;
    top: 10%;
  `}
`;

const WeatherWrapper = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  height: calc(100vh - 65px);
  width: 100%;
  position: relative;
`;

class App extends React.Component {
  state = {  //Объект state описывает внутреннее состояние компонента.State (состояние) в React – это объект JS, позволяющий отслеживать данные компонента.
    value: '',
    weatherInfo: null,
    error: false,
  };

  handleInputChange = e => { //метода, который будет вызываться для обновления.
    this.setState({  //setState() добавляет в очередь изменения в состоянии компонента. Также он указывает React, что компонент и его дочерние элементы должны быть повторно отрендерены с обновлённым состоянием. Этот метод используется для обновления интерфейса в ответ на обработчики событий и ответы сервера.
      value: e.target.value,
    });
  };

  handleSearchCity = e => {
    e.preventDefault(); // метод preventDefault() объекта Event при вызове отменяет действие события по умолчанию. Событие продолжает распространяться как обычно, только с тем исключением, что событие ничего не делает.
    const { value } = this.state;
    const APIkey = '87fe29d34b190a3a49693b18b96c4659';

    const weather = `https://api.openweathermap.org/data/2.5/weather?q=${value}&APPID=${APIkey}&units=metric`;
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&APPID=${APIkey}&units=metric`;

    Promise.all([fetch(weather), fetch(forecast)]) //Метод Promise.all принимает массив промисов (может принимать любой перебираемый объект, но обычно используется массив) и возвращает новый промис.
        .then(([res1, res2]) => { //Метод then() возвращает Promise (обещание). Метод принимает два аргумента, колбэк-функции для случаев выполнения и отказа соответственно.
          if (res1.ok && res2.ok) {
            return Promise.all([res1.json(), res2.json()]);
          }
          throw Error(res1.statusText, res2.statusText); //Инструкция throw позволяет генерировать исключения, определяемые пользователем. Выражение определяемое пользователем исключение
        })
        .then(([data1, data2]) => {
          const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const currentDate = new Date();
          const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
              months[currentDate.getMonth()]
          }`;
          const sunset = new Date(data1.sys.sunset * 1000).toLocaleTimeString().slice(0, 5);
          const sunrise = new Date(data1.sys.sunrise * 1000).toLocaleTimeString().slice(0, 5);

          const weatherInfo = {
            city: data1.name,
            country: data1.sys.country,
            date,
            description: data1.weather[0].description,
            main: data1.weather[0].main,
            temp: data1.main.temp,
            highestTemp: data1.main.temp_max,
            lowestTemp: data1.main.temp_min,
            sunrise,
            sunset,
            clouds: data1.clouds.all,
            humidity: data1.main.humidity,
            wind: data1.wind.speed,
            forecast: data2.list,
          };
          this.setState({
            weatherInfo,
            error: false,
          });
        })
        .catch(error => { //Метод catch() возвращает Promise(обещание) и работает только в случае отклонения обещания.
          console.log(error);

          this.setState({
            error: true,
            weatherInfo: null,
          });
        });
  };

  render() { //Элемент описывает то, что вы хотите увидеть на экране   //При вызове он проверяет this.props и this.state и возвращает один из следующих вариантов:
                // Элемент React
                // Массивы и фрагменты
                // Порталы
                // Строки и числа
                // Booleans или null

    const { value, weatherInfo, error } = this.state;
    return ( //Условный рендеринг в React работает так же, как условные выражения работают в JavaScript. Бывает нужно объяснить React, как состояние влияет на то, какие компоненты требуется скрыть, а какие — отрендерить, и как именно.
        //Wrapper используют для удобства позиционирования
        <>
          <AppTitle showLabel={(weatherInfo || error) && true}>Galileo</AppTitle>
            <WeatherWrapper>
            <AppTitle secondary showResult={(weatherInfo || error) && true}>
              Galileo
            </AppTitle>

            <SearchCity
                value={value}
                showResult={(weatherInfo || error) && true}
                change={this.handleInputChange}
                submit={this.handleSearchCity}
            />
            {weatherInfo && <Result weather={weatherInfo} />}
            {error && <NotFound error={error} />}
          </WeatherWrapper>
        </>
    );

  }
}

export default App;

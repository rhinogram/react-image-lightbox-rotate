import React, {Component} from 'react';
import ReactImageLightbox, {changeAngle} from './override';
import PropTypes from 'prop-types';

import styles from './styles.scss';

/**
 * Class ReactImageLightboxRotate
 */
class ReactImageLightboxRotate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rotate: 0,
            prevRotate: 0,
            nextRotate: 0,
        };
    }

    componentDidMount() {
        styles._insertCss();
    }


    changeRotation(angle) {
        let nextAngle = this.state.rotate + angle;
        if (nextAngle < 0) {
            nextAngle = 270;
        }
        this.setState({rotate: nextAngle});
        this.props.onImageRotate(nextAngle);
    }

    resetRotation() {
        this.setState({rotate: 0});
    }

    preservationRotation(angle) {
        this.setState({rotate: angle});
    }

    resetPrevRotation() {
        this.setState({prevRotate: 0});
    }

    preservationPrevRotation(angle) {
        this.setState({prevRotate: angle});
    }

    resetNextRotation() {
        this.setState({nextRotate: 0});
    }

    preservationNextRotation(angle) {
        this.setState({nextRotate: angle});
    }

    get svg() {
        return <svg className="icon icon-rotate" xmlns="http://www.w3.org/2000/svg" width="512"
                    height="512"
                    viewBox="0 0 16 16">
            <path fill="#ddd"
                  d="M16 7V3l-1.1 1.1C13.6 1.6 11 0 8 0 3.6 0 0 3.6 0 8s3.6 8 8 8c2.4 0 4.6-1.1 6-2.8l-1.5-1.3C11.4 13.2 9.8 14 8 14c-3.3 0-6-2.7-6-6s2.7-6 6-6c2.4 0 4.5 1.5 5.5 3.5L12 7h4z"/>
        </svg>;
    }

    handleMovePrev() {
        if(this.props.onMovePrevRequest && (this.state.rotate >0 || this.state.prevRotate > 0)){
            return () => {
                if (this.state.prevRotate > 0) {
                    this.preservationRotation(this.state.prevRotate);
                    this.resetPrevRotation();
                }else {
                    if(this.props.saveBeforeAfterState){
                        this.preservationNextRotation(this.state.rotate);
                    }
                    this.resetRotation(0);
                    changeAngle(0);
                }
                this.props.onMovePrevRequest();
            };
        }
        return this.props.onMovePrevRequest
    }

    handleMoveNext() {
        if(this.props.onMoveNextRequest && this.state.rotate >0 ||  this.state.nextRotate > 0){
            return () => {
                if(this.state.nextRotate > 0) {
                    this.preservationRotation(this.state.nextRotate);
                    this.resetNextRotation(0);
                } else {
                    if(this.props.saveBeforeAfterState){
                        this.preservationPrevRotation(this.state.rotate);
                    }
                    this.resetRotation(0);
                    changeAngle(0);
                }
                this.props.onMoveNextRequest();
            };
        }else{
            return () => {
                this.resetPrevRotation();
                this.props.onMoveNextRequest();
            }
        }
    }

    render() {
        const noop = () => {
        };

        const rotateRightButtonClasses = [
            ReactImageLightbox.toolbarItemChild,
            ReactImageLightbox.builtinButton,
            styles.rotateRightButton,
        ];
        const rotateLeftButtonClasses = [
            ReactImageLightbox.toolbarItemChild,
            ReactImageLightbox.builtinButton,
            styles.rotateLeftButton,
        ];

        let rotateLeftButtonHandler = () => this.changeRotation(-90);
        let rotateRightButtonHandler = () => this.changeRotation(90);

        if (this.lightBox && this.lightBox.isAnimating()) {
            rotateLeftButtonHandler = noop;
            rotateRightButtonHandler = noop;
        }

        changeAngle(this.state.rotate);

        let toolbarButtons = this.props.toolbarButtons ? this.props.toolbarButtons : []
        toolbarButtons = toolbarButtons.concat(
          [
              <button
                  type="button"
                  key="rotate-left"
                  className={`ril-rotate-left ${rotateLeftButtonClasses.join(' ')}`}
                  onClick={rotateLeftButtonHandler}
              >
                  {this.svg}
              </button>,
              <button
                  type="button"
                  key="rotate-right"
                  className={`ril-rotate-right ${rotateRightButtonClasses.join(' ')}`}
                  onClick={rotateRightButtonHandler}
              >
                  {this.svg}
              </button>
          ]
        )
        const props = Object.assign({}, this.props, {
            onMovePrevRequest: this.handleMovePrev(),
            onMoveNextRequest: this.handleMoveNext(),
            toolbarButtons,
            ref: (lightBox) => this.lightBox = lightBox,
            wrapperClassName: this.rotateClassName,
        });

        return <ReactImageLightbox {...props} />
    }
}

ReactImageLightboxRotate.defaultProps = Object.assign({}, ReactImageLightbox.defaultProps, {
    onImageRotate: () => {
    },
});

ReactImageLightboxRotate.propTypes = Object.assign({}, ReactImageLightbox.propTypes, {
    onImageRotate: PropTypes.func,
});

export default ReactImageLightboxRotate;

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
        return <svg className="icon icon-rotate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#ddd" d="M24 10.1V3.4c0-.6-.4-1-1-1s-1 .4-1 1v4.3l-3.4-3.2C15.2 1.1 9.9.3 5.6 2.7 1.4 5-.8 9.9.3 14.6c1.1 4.7 5.2 8.2 10 8.5h.6c4.6 0 8.7-2.9 10.3-7.3.2-.5-.1-1.1-.6-1.3-.5-.2-1.1.1-1.3.6-1.3 3.7-5 6.1-8.9 5.9-3.9-.2-7.3-3.1-8.2-6.9-.9-3.8.9-7.9 4.4-9.8 3.5-1.9 7.8-1.3 10.6 1.5L20.5 9h-4.1c-.6 0-1 .4-1 1s.4 1 1 1H23c.1 0 .2 0 .2-.1h.1l.1-.1c.1 0 .2-.1.2-.2 0 0 0-.1.1-.1 0-.1.1-.1.1-.2.2 0 .2-.1.2-.2z"/></svg>;
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
        const onMoveNextRequesButtonClasses = [
            ReactImageLightbox.toolbarItemChild,
            ReactImageLightbox.builtinButton,
        ];

        let rotateRightButtonHandler = () => this.changeRotation(90);

        if (this.lightBox && this.lightBox.isAnimating()) {
            rotateRightButtonHandler = noop;
        }

        changeAngle(this.state.rotate);

        let toolbarButtons = this.props.toolbarButtons ? this.props.toolbarButtons : []
        toolbarButtons = toolbarButtons.concat(
          [
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

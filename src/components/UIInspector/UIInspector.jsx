import React, { PropTypes as T } from 'react';
import ComponentInspector from './ComponentInspector.jsx';
import { DropTarget } from 'react-dnd';

const inspectorTarget = {
    drop(props, monitor, component) {
        console.log(component)
        component.addComponent(monitor.getItem())
    }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

@DropTarget('COMPONENT', inspectorTarget, collect)
export default class UIInspector extends React.Component {

    static propTypes = {
        components: T.arrayOf(T.shape({
            name: T.string,
            componentProps: T.object,
            componentChildren: T.oneOfType([T.element, T.string, T.array])
        }))
    }

    constructor(props) {
        super(props);
        this.state = {
            components: props.components.slice()
        }
    }

    addComponent = (component) => {
        const newComponents = this.state.components.slice();
        newComponents.push(component);
        this.setState({ components: newComponents });
    }

    removeComponent = (index) => {
        const newComponents = this.state.components.slice();
        newComponents.splice(index, 1);
        this.setState({ components: newComponents });
    }

    render() {
        const { components } = this.state;
        const { connectDropTarget, isOver } = this.props;
        const inspectors = components.map((c, index) => {
            return <ComponentInspector
                component={c}
                key={Math.random()}
                index={index}
                removeComponent={this.removeComponent}/>
        });
        return connectDropTarget(
            <div>
                {inspectors}
            </div>
        );
    }
}

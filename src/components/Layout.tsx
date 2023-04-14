import React, {PropsWithChildren, useRef, useState} from 'react';
import {FlatList} from 'react-native';
import Header from './Header';

type LayoutProps = PropsWithChildren<{
  title?: string;
}>;

export default function Layout({children, title}: LayoutProps) {
  const scrollRef = useRef(null);
  const [_scrollY, setScrollY] = useState(0);

  const DATA = [
    {
      id: 'header',
      content: <Header title={title} />,
    },
    {
      id: 'children',
      content: children,
    },
  ];

  return (
    <FlatList
      ref={scrollRef}
      data={DATA}
      keyExtractor={item => item.id}
      renderItem={({item}) => <React.Fragment>{item.content}</React.Fragment>}
      onScroll={({nativeEvent: {contentOffset}}) => {
        setScrollY(contentOffset.y);
      }}
      scrollEventThrottle={16}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll={true}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

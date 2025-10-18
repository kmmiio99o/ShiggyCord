import { NavigationNative } from "@metro/common";
import { findByPropsLazy } from "@metro/wrappers";
import { ErrorBoundary } from "@ui/components";
import { RowConfig } from "@ui/settings";

const tabsNavigationRef = findByPropsLazy("getRootNavigationRef");

export const CustomPageRenderer = React.memo(() => {
  const navigation = NavigationNative.useNavigation();
  const route = NavigationNative.useRoute();

  // Accept `render` as a render-function (recommended) or a component.
  // Respect `noErrorBoundary` param to allow callers to opt out of wrapping.
  const {
    render: PageComponent,
    noErrorBoundary = false,
    ...args
  } = route.params ?? {};

  React.useEffect(
    () => void navigation.setOptions({ ...args }),
    [navigation, args],
  );

  // Normalize to a React element. PageComponent may be:
  // - a function returning a React element (render wrapper): () => <Comp />
  // - a React component type: MyComponent
  // - a React element (unlikely), in which case return as-is.
  const element = React.useMemo(() => {
    if (!PageComponent) return null;
    try {
      // If caller provided a render function (common in this codebase), invoke it to get the element.
      if (typeof PageComponent === "function") {
        // When PageComponent is a component type, invoking it directly could be unsafe for class components.
        // However, most callers pass a zero-arg render function that returns an element (e.g. () => <MyComp />),
        // so prefer calling it. If it returns something that looks like a React element, use it.
        const maybeEl = PageComponent();
        return maybeEl;
      }

      // Otherwise assume it's already a React element.
      return PageComponent as any;
    } catch {
      // As a last resort, attempt JSX-style rendering so component types still work.
      try {
        return <PageComponent />;
      } catch {
        return null;
      }
    }
  }, [PageComponent]);

  if (noErrorBoundary) {
    return element;
  }

  return <ErrorBoundary>{element}</ErrorBoundary>;
});

export function wrapOnPress(
  onPress: (() => unknown) | undefined,
  navigation?: any,
  renderPromise?: RowConfig["render"],
  screenOptions?: string | Record<string, any>,
  props?: any,
) {
  return async () => {
    if (onPress) return void onPress();

    const Component = await renderPromise!!().then((m) => m.default);

    if (typeof screenOptions === "string") {
      screenOptions = { title: screenOptions };
    }

    navigation ??= tabsNavigationRef.getRootNavigationRef();
    navigation.navigate("SHIGGYCORD_CUSTOM_PAGE", {
      ...screenOptions,
      render: () => <Component {...props} />,
    });
  };
}

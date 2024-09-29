# PyUIBuilder Documentation

>[!NOTE]
This is a temporary documentation, the page will be updated as more features are added.


## Basics Widgets understanding

Every widget has its own attributes, some of the attributes may be common.

1. **MainWindow:** Every UI needs to have one main window. If you don't have any main window, the output will not be generated. 
   
   If you have multiple Main Window you'll be asked to delete one window at the time of code generation.

2. **Layouts:** Every widget that can hold a child widget has three different layouts.

   1. Flex(also known as pack)
   2. Grid
   3. Absolute/Place
   
   The parents of the child widgets controls the layout. The layout properties such as grid position will be available to the child under the grid-manager/flex-manager section.


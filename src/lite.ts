import FormContainer from "./models/FormContainer";
import ExcelToFormModel from "./services/ExcelToFormModel";
import  "./adaptiveform.css";

  let createFormContainer = async (formLink: HTMLLinkElement) => {
    if(formLink && formLink?.href) {
      
      let url = formLink.href;
      console.log("Loading & Converting excel form to Crispr Form")
      console.time('Json Transformation (including Get)');
      const transform = new ExcelToFormModel();
      const convertedData = await transform.getFormModel(url);
      console.timeEnd('Json Transformation (including Get)')
      console.log(convertedData);

      console.log("Creating Form Container")
      console.time('Form Model Instance Creation');
      let formContainer = new FormContainer({_formJson : convertedData?.formDef, _path: url})
      console.timeEnd('Form Model Instance Creation');
      
      //@ts-ignore
      window.guideContainer = formContainer
      console.time('Form Rendition');
      formContainer.render(formLink);
      console.timeEnd('Form Rendition');
    }
  }
  
  export default async function decorate(block:Element) {
    const formLink: HTMLLinkElement | null = block?.querySelector('a[href$=".json"]');
    if(formLink && formLink?.href) {
        await createFormContainer(formLink);
    }
  }